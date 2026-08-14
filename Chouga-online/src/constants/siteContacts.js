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
};

export function buildWhatsAppUrl(message = "") {
  const baseUrl = `https://wa.me/${siteContacts.phone.digits}`;

  if (!message) {
    return baseUrl;
  }

  return `${baseUrl}?text=${encodeURIComponent(message)}`;
}
