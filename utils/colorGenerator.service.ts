export default function colorGenerator(input: string): string {
    let hash = 0

    for (let i = 0; i < input.length; i++) {
        hash = input.charCodeAt(i) + ((hash << 5) - hash)
    }

    let color = '#'

    for (let i = 0; i < 3; i++) {
        let value = (hash >> (i * 8)) & 0xff;
        color += ('00' + value.toString(16)).substr(-2)
    }

    return (
        '#' +
        color
            .replace(/^#/, '')
            .replace(/../g, value =>
                (
                    '0' +
                    Math.min(255, Math.max(0, parseInt(value, 16) + -20)).toString(16)
                ).substr(-2),
            )
    )
}