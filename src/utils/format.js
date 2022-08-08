export function formatDate(text) {
  let formattedDate = text.replace(/\D/g, '')
  const textLength = formattedDate.length

  if (textLength <= 2) {
    formattedDate = formattedDate.replace(/(\d{1,2})/g, '$1')
  } else if (textLength <= 4) {
    formattedDate = formattedDate.replace(/(\d{2})(\d{1,2})/g, '$1/$2')
  } else if (textLength <= 8) {
    formattedDate = formattedDate.replace(
      /(\d{2})(\d{2})(\d{1,4})/g,
      '$1/$2/$3',
    )
  } else {
    formattedDate = formattedDate
      .substr(0, 8)
      .replace(/(\d{2})(\d{2})(\d{4})/g, '$1/$2/$3')
  }

  return formattedDate
}

export function formatCPF(text) {
  let cpf = text

  cpf = cpf.replace(/\D/g, '')
  if (cpf.length <= 6) {
    cpf = cpf.replace(/(\d{3})(\d{1,3})/g, '$1.$2')
  } else if (cpf.length <= 9) {
    cpf = cpf.replace(/(\d{3})(\d{3})(\d{1,3})/g, '$1.$2.$3')
  } else if (cpf.length <= 11) {
    cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/g, '$1.$2.$3-$4')
  } else {
    cpf = cpf
      .substr(0, 11)
      .replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/g, '$1.$2.$3-$4')
  }

  return cpf
}

export function formatPostalCode(text) {
  let cep = text.replace(/\D/g, '')

  if (cep.length <= 8) {
    cep = cep.replace(/^(\d{5})(\d)/, '$1-$2')
  } else {
    cep = cep.substr(0, 8).replace(/^(\d{5})(\d)/, '$1-$2')
  }

  return cep
}

export function formatPhone(text) {
  let phone = text

  phone = phone.replace(/\D/g, '')
  if (phone.length <= 7) {
    phone = phone.replace(/^(\d{2})(\d)/, '($1) $2')
  } else if (phone.length <= 10) {
    phone = phone.replace(/(\d{2})(\d{4})(\d)/g, '($1) $2-$3')
  } else if (phone.length <= 11) {
    phone = phone.replace(/(\d{2})(\d{5})(\d)/g, '($1) $2-$3')
  } else {
    phone = phone.substr(0, 11).replace(/(\d{2})(\d{5})(\d)/g, '($1) $2-$3')
  }

  return phone
}

export function formatMoney(text) {
  const value = parseFloat(text).toFixed(2)
  return 'R$ ' + value.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
}
