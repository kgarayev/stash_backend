// function to generate UK account number and sort code 

// import asyncMySQL function
import { number } from "joi";
import { asyncMySQL } from "../database/connection";

// import queries
import { queries } from "../database/queries";
  

const accountDetails = async ()=> {

    console.log("hello from account details function");

    let accountNumber = ""
    let sortCode = ""

    try {
        const latestNumber = await asyncMySQL(`SELECT MAX(account_number) FROM accounts`);
        const latestCode = await asyncMySQL(`SELECT MAX(sort_code) FROM accounts`);

        if (latestNumber && !isNaN(Number(latestNumber))) {
            accountNumber = String(Number(latestNumber) + 1);
        } else {
            accountNumber = "20304050"
        }
    
        if (latestCode && !isNaN(Number(latestCode))) {
            sortCode = String(Number(latestCode) + 1);
        } else {
            sortCode = "102030"
        }
    } catch (e) {
        console.log(e);
    }

    console.log(accountNumber, sortCode);
    

    return {accountNumber, sortCode}
}


export {accountDetails}