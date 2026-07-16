const GetRandom = async () => {
  const res = await new Promise<number>((res) => {
    setTimeout(() => {
      res(Math.random())
    })
  })
  return res
}

export default GetRandom
