export function dateTimeConverter(dateTime: string) {
    const date = new Date(dateTime)
    const options = { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }
    // @ts-ignore
    const vietnamTime = date.toLocaleString('en-US', options)
    return vietnamTime
}