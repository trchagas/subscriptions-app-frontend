export function errorApi(err, genericError) {
  if (!genericError) {
    genericError = 'Falha ao buscar os dados! Tente novamente.'
  }
  const hasErrorResponseData = err.response && err.response.data
  let customError = genericError
  if (hasErrorResponseData) {
    const data = err.response.data
    if (data[0] && data[0].message) customError = data[0].message
    else if (data.message) customError = data.message
  }
  return customError
}
