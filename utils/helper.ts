export function truncate(str: string, length: number) {
  if (str.length <= length) {
    return str;
  }
  return str.slice(0, length) + "...";
}

const ads = [
  { _id: '65698d68e42b5392e91ef60f', emoji: 'haha' },
  { _id: '65698d68e42b5392e91ef60f', emoji: 'haha' },
]