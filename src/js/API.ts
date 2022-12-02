import axios from "axios";

const baseURL = "http://localhost:3000/";

export function fetchContacts() {
  return axios.get(baseURL + "/bloggers");
}

/*
export function postContact(newContact, token) {
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios.post(baseURL + "/contacts", newContact, config);
}

export function delContact(id, token) {
  const deleteURL = baseURL + "/contacts/" + id.toString();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios.delete(deleteURL, config);
}

export function patchContact(id, updatedContact, token) {
  
  //updatedContact = same schema as for new contact
  
  const updateURL = baseURL + "/contacts/" + id.toString();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios.patch(updateURL, updatedContact, config);
}

*/

