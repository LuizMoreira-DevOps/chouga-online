export const siteContacts = {
  email: "skateboardchouga@gmail.com",

  phone: {
    display: "(41) 9 9751-3996",
    international: "+5541997513996",
    digits: "5541997513996",
  },

  instagram: {
    username: "chougaskateboard_",
    url: "https://instagram.com/chougaskateboard_/",
  },

  location: "Curitiba - PR / Brasil",

  whatsappMessages: {
    contact:
      "Salve, Chouga! Vim pela página Fale com a gente e queria trocar uma ideia.",

    footer:
      "Salve, Chouga! Vim pelo site e queria saber mais sobre os produtos.",

    product: "Olá! Tenho interesse neste produto da Chouga:",
  },
};

export function buildWhatsAppUrl(message = "") {
  const baseUrl = `https://wa.me/${siteContacts.phone.digits}`;

  if (!message) {
    return baseUrl;
  }

  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}
