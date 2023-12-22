export default function signName(name: string) {
    const parts = name.split(/[ -]/)
    let initials = ''
    for (let i = 0; i < parts.length; i += 1) {
        initials += parts[i].charAt(0)
    }
    if (initials.length > 2 && initials.search(/[A-Z]/) !== -1) {
        initials = initials.replace(/[a-z]+/g, '')
    }
    initials = initials.substr(0, 2).toUpperCase()
    return initials.toString();
}