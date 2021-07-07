module.exports = {
    email: {
        expression: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: 'must be a valid email'
    },
    required: {
        expression: /\S+/,
        message: 'is required'
    },
    onlyLetters: {
        expression: /^[a-zA-z]*$/,
        message: 'can only contain letters'
    },
    currency: {
        expression: /^\d+(\.\d{2})?$/,
        message: 'must be a dollar amount'
    },
    integer: {
        expression: /^\d*$/,
        message: 'must be a whole number'
    },
    number: {
        expression: /^\d+(\.\d+)?/,
        message: 'must be a number',
    },
    minLength: (len) => {
        return {
            expression:  RegExp(`.{${len},}`),
            message: `must be at least ${len} characters long`
        }
    },
    maxLength: (len) => {
        return {
            expression:  RegExp(`^.{0,${len}}$`),
            message: `must be ${len} characters or fewer`
        }
    }

}