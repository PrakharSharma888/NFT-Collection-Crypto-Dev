// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  const tokenId = req.query.tokenId
  const name = `Crypto Dev #${tokenId}`;
  const description = "Crypto Devs is a NFT collection made by Prakhar Sharma";
  const image = `https://raw.githubusercontent.com/PrakharSharma888/NFTCollection-CryptoDev/main/public/${Number(tokenId)-1}.jpg`;

    return res.json({
      name : name,
      description : description,
      image : image
    })
}
