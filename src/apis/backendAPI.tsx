import axios from "axios";

const API_URL = "https://daistaking.onrender.com/api/v1/";
const API_URL_apy = "https://daistaking.onrender.com/api/v2/";

// const API_URL = "http://localhost:8080/api/v1/";
// const API_URL_apy = "http://localhost:8080/api/v2/";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const axiosInstance_apy = axios.create({
  baseURL: API_URL_apy,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const checkParent_api = async (referralCode: string) => {
  try {
    const response: any = await axiosInstance.post(`/user/checkParent`, {
      referralCode,
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// export const findUser = async (address: string, referralCode: string, balance: number) => {
//   try {
//     const response = await axiosInstance.post(`/user/find-user`, {
//       address, balance, referralCode
//     });

//     return response.data;
//   } catch (error) {
//     console.log(error);
//   }
// };

export const findUser = async (address: string) => {
  try {
    const response = await axiosInstance.post(`/find-user`, {
      address,
    });
    // console.log(response);
    return response.data;
  } catch (error) {
    // console.log(error);
  }
};


export const transferBalance = async (userId: number, amount: number, toAddress: string) => {
  try {
    const response: any = await axiosInstance.post(`/user/transferBalance`, {
      userId,
      toAddress,
      amount,
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
};


export const registerUser = async (address: string, parrent_add: string, signature: any, nonce: any, deadline: any, admin: string) => {
  console.log("regist api")
  try {
    const response = await axiosInstance.post(`/register`, {
      address,
      parrent_add,
      signature,
      nonce,
      deadline,
      admin
    });
    // console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};


export const withdrawUpdate = async (address: string, amount: number, withType: number) => {
  try {
    const response = await axiosInstance.post(`/withdraw-update`, {
      address,
      amount,
      withType,
    });
    
    return response.data;
  } catch (error) {
    // console.log(error);
  }
};