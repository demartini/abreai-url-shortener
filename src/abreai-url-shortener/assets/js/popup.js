chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  const longUrl = tabs[0].url
  shortenUrl(longUrl).then(showResult).catch(showError)
})

async function shortenUrl(longUrl) {
  if (!/^https?:\/\//.test(longUrl)) {
    throw new Error('Invalid input URL')
  }

  const response = await fetch(`https://abre.ai/generate.txt?url=${longUrl}`)

  return response.text()
}

function showResult(shortUrl) {
  const qr = document.getElementById('qr')
  const input = document.getElementById('url')
  const msg = document.getElementById('copied')

  input.value = shortUrl

  new QRCode(qr, {
    text: shortUrl,
    width: 270,
    height: 270
  })

  qr.className = 'done'

  input.parentElement.onclick = function () {
    input.select()
    if (document.execCommand('copy')) {
      msg.className = 'visible'
      setTimeout(() => {
        msg.className = ''
      }, 2000)
    }
  }
}

function showError() {
  const qr = document.getElementById('qr')
  qr.className = 'error'
}

document.getElementById('copied').textContent = chrome.i18n.getMessage('copied')
