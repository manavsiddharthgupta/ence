export async function GET(request: Request) {
  const verify_token = process.env.VERIFY_TOKEN

  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode && token) {
    if (mode === 'subscribe' && token === verify_token) {
      return new Response(`${challenge}`, { status: 200 })
    } else {
      return new Response('Failed to verify webhook', { status: 403 })
    }
  }
}

// Todo:
// export async function POST(request: NextApiRequest) {
//   const whatsapp_token = process.env.WHATSAPP_TOKEN

//   if (request.body.object) {
//     if (
//       request.body.entry &&
//       request.body.entry[0].changes &&
//       request.body.entry[0].changes[0] &&
//       request.body.entry[0].changes[0].value.messages &&
//       request.body.entry[0].changes[0].value.messages[0]
//     ) {
//       let phone_number_id =
//         request.body.entry[0].changes[0].value.metadata.phone_number_id
//       let from = request.body.entry[0].changes[0].value.messages[0].from
//       let msg_body =
//         request.body.entry[0].changes[0].value.messages[0].button.text

//       if (msg_body === 'Approve') {
//         console.log('---> in approve')
//         fetch(
//           'https://graph.facebook.com/v12.0/' +
//             phone_number_id +
//             '/messages?access_token=' +
//             whatsapp_token,
//           {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               messaging_product: 'whatsapp',
//               to: from,
//               text: {
//                 body: 'https://ence.in'
//               }
//             })
//           }
//         )
//           .then((response) => response.json())
//           .then((data) => {
//             console.log('Approval response:', data)
//           })
//           .catch((error) => {
//             console.error('Approval error:', error)
//           })
//         return
//       } else if (msg_body === 'Reject') {
//         fetch(
//           'https://graph.facebook.com/v12.0/' +
//             phone_number_id +
//             '/messages?access_token=' +
//             whatsapp_token,
//           {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               messaging_product: 'whatsapp',
//               to: from,
//               text: {
//                 body: 'Sorry! We are improving our services each day.'
//               }
//             })
//           }
//         )
//           .then((response) => response.json())
//           .then((data) => {
//             console.log('Rejection response:', data)
//           })
//           .catch((error) => {
//             console.error('Rejection error:', error)
//           })
//         return
//       }
//       return
//     }
//     return new Response('Success', { status: 200 })
//   } else {
//     return new Response('Not found', { status: 404 })
//   }
// }
