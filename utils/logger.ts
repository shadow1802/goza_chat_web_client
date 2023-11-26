const log = {
    error: (errors: any) => {
        console.log(`\x1b[31m Error: ${JSON.stringify(errors)} \x1b[0m`)
        return `\x1b[31m Error: ${JSON.stringify(errors)} \x1b[0m`
    },
    success: (errors: any) => {
        console.log(`\x1b[32m Success: ${JSON.stringify(errors)} \x1b[0m`)
        return `\x1b[32m Success: ${JSON.stringify(errors)} \x1b[0m`
    }
}

export default log