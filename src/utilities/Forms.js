class Form {

    /**
     * Validate Login
     * @param str 
     * @returns boolean
     */
    static validUsername(str) {
        const regex = /^[a-zA-Z0-9_]{5,15}$/;
        return regex.test(str);
    }

    /**
     * Minimum length of string
     * @param str 
     * @param length 
     * @returns 
     */
    static minLength(str, length) {
        let isInvalid = false;

        if (str.length < length) {
            isInvalid = true;
        }

        return isInvalid;
    }

    /**
     * Form Validator
     * @param  obj 
     * @returns 
     */
    static validator(obj) {
        let keys = Object.entries(obj);
        let results = [];
        let validations = null;

        keys.map((key) => {
            if ('isRequired' in key[1] && key[1].isRequired) {
                if (key[1].value.length === 0) {
                    results.push({
                        [key[0]]: [`The ${key[0]} is required.`]
                    });
                } else {
                    if ('isUsername' in key[1] && key[1].isUsername) {
                        let isValidUsername = Form.validUsername(key[1].value);

                        if (!isValidUsername) {
                            results.push({
                                [key[0]]: [`The ${key[0]} must be valid username.`]
                            });
                        }
                    }

                    if ('minLength' in key[1] && Form.minLength(key[1].value, key[1].minLength)) {
                        results.push({
                            [key[0]]: [`The ${key[0]} must at least ${key[1].minLength} characters.`]
                        });
                    }
                }
            } else if ('isUsername' in key[1]) {
                let isValidUsername = Form.validUsername(key[1].value);

                if (!isValidUsername) {
                    results.push({
                        [key[0]]: [`The ${key[0]} must be valid username`]
                    });
                }
            } else if ('minLength' in key[1] && Form.minLength(key[1].value, key[1].minLength)) {
                results.push({
                    [key[0]]: [`The ${key[0]} must at least ${key[1].minLength} characters.`]
                });
            }
            return results
        })

        results = Object.assign({}, ...results.map((result) => result))

        if (Object.keys(results).length > 0) {
            validations = {
                errors: results
            }
        } else {
            validations = null
        }

        return validations;
    }
}

export default Form