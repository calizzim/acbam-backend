const Taxes = require("../classes/Taxes");
const taxHelper = new Taxes();
const ChartFunctions = require("../classes/ChartFunctions");

module.exports = {
  dependencies: {
    hard: [
    ],
    soft: [
    ]
  },
  template: {
    title: "Savings",
    showTitle: false,
    resetOnSubmit: false,
    groups: [
      {
        title: "salaryInfo",
        showTitle: true,
        components: [
          {
            dType: Number,
            type: "text",
            name: "pretaxSalary",
            validators: "currency",
            hint: "monthly or yearly salary in dollars",
          },
          {
            dType: String,
            type: "radio",
            name: "salaryType",
            validators: "radio",
            options: ["monthly", "yearly"],
          },
          {
            dType: Number,
            type: "text",
            name: "salaryGrowthPercentage",
            validators: "integer",
            hint: "By what percent do you expect your salary to grow every year? The national average is around 3%",
            defaultValue: "3",
          },
        ],
      },
      {
        title: "taxInfo",
        showTitle: true,
        components: [
          {
            dType: String,
            type: "dropdown",
            name: "state",
            validators: "dropdown",
            options: "states",
          },
          {
            dType: String,
            type: "radio",
            name: "filingStatus",
            validators: "radio",
            options: ["single", "married"],
          },
        ],
      },
      {
        title: "savingsInfo",
        showTitle: true,
        components: [
          {
            dType: Number,
            type: "text",
            name: "savingPercentage",
            validators: "number",
            hint: "What percent of your post tax salary do you want to save? We assume that you will max your 401k contribution ($19,500) before saving in other accounts in order to minimize federal and state income tax.",
          },
          {
            dType: Number,
            type: "text",
            name: "investmentReturns",
            validators: "number",
            hint: "What percent returns do you expect to make on your savings? The Dow has averaged 10.7 percent over the last 30 years.",
            defaultValue: "7",
          },
        ],
      },
      {
        title: "retirementGoal",
        showTitle: true,
        components: [
          {
            dType: Number,
            type: "text",
            name: "currentAge",
            validators: "integer",
            hint: "how old are you now?",
          },
          {
            dType: Number,
            type: "text",
            name: "retirementAge",
            validators: "integer",
            hint: "whats your ideal retirement age?",
          },
        ],
      },
    ],
  },
  computed: [
    {
      name: "pretaxSalary",
      compute: (native, computed, previous) => {
        return native.salaryType == "monthly"
          ? native.pretaxSalary * 12
          : native.pretaxSalary;
      },
    },
    {
      name: 'dataOverTime',
      compute: (native,computed,previous) => {
        let numMonths = (native.retirementAge - native.currentAge) * 12
        let xvalues = [...Array(numMonths + 1).keys()]
        let yvalues = xvalues.slice(1).reduce((a,c,i) => {
          let pretaxSalary = a[i].pretaxSalary * (native.salaryGrowthPercentage/1200 + 1)
          let taxes = taxHelper.getTaxes(pretaxSalary, native.savingPercentage, native.state, native.filingStatus)
          let savings = (pretaxSalary - taxes.total) * native.savingPercentage / 100
          let totalSavings = (a[i].totalSavings + savings/12) * (1+native.investmentReturns/1200)
          return a.concat({ 
            pretaxSalary, 
            taxes, 
            savings, 
            totalSavings, 
            leftOver: pretaxSalary - taxes.total - savings
          })
        },
        [{
          totalSavings: 0,
          pretaxSalary: computed.pretaxSalary
        }])
        let data = ChartFunctions.monthsToYears(xvalues,yvalues)
        data.xvalues = data.xvalues.map(v => v + native.currentAge)
        return data
      }
    },
    {
      name: 'initialData',
      compute: (native,computed,previous) => {
        return computed.dataOverTime.yvalues[1]
      }
    },
    {
      name: 'leftOver',
      compute: (native,computed,previous) => {
        return computed.initialData.leftOver
      }
    },
    {
      name: 'spendingPercentagesChart',
      compute: (native,computed,previous) => {
        let labels = ['federal taxes','fica','state taxes','total savings','left for discretionary spending']
        let yvalues = computed.dataOverTime.yvalues.slice(1).map(v => {
          return [v.taxes.federal,v.taxes.fica,v.taxes.state,v.savings,v.leftOver]
        })
        return {labels, yvalues}
      }
    },
    {
      name: 'netWorthChart',
      compute: (native,computed,previous) => {
        return { 
          xvalues: computed.dataOverTime.xvalues, 
          yvalues: computed.dataOverTime.yvalues.map(v => v.totalSavings)
        }
      }
    },
  ],
};
