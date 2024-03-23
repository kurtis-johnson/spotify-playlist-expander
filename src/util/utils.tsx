export function generateRandomString(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

export async function getListItemsResponse(getUrl: URL, accessToken: String) {
  let response: any;
  try {
    await fetch(getUrl, {
      method: "GET",
      headers: {
        authorization: `Bearer ${accessToken}`,
      }
    }).then(r => {
      return r.json();
    }).then(responseJson => response = responseJson);
  } catch (error) {
    console.error(error);
  }
  return response;
}