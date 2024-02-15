import React, { useState, useEffect } from 'react';
import MedicalRecord from "./artifacts/contracts/MedicalRecord.sol/MedicalRecord.json";
import './App.css';
import './SetDetails.css';

const ethers = require("ethers");

const contractAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const abi = MedicalRecord;

const SetDetails = () => {
  // State variables for form data
  const [ssn, setSSN] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [homeaddr, setHomeaddr] = useState('');
  const [bloodgroup, setBloodgroup] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medication, setMedication] = useState('');

   // ... other state variables
   const [provider, setProvider] = useState(null);
   const [signer, setSigner] = useState(null);
   const [contract, setContract] = useState(null);
   const [error, setError] = useState(null);
   const [loading, setLoading] = useState(null);

  // ... connectWallet function


    const submitMedicalRecord = async () => {
      try {
        setLoading(true);
  
        // Input validation
        if (!ssn || !name || !phone || !gender || !dob || !homeaddr || !bloodgroup || !allergies || !medication) {
          setError('Please fill in all fields.');
          setLoading(false);
          return;
        }
  
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
  
        const medicalRecordContract = new ethers.Contract(contractAddress, abi.abi, signer);
        const gasPrice = await provider.getGasPrice(); // Fetch current gas price dynamically
        const gasLimit = 3264481; // Adjust based on contract requirements
        
        const encodedParameters = medicalRecordContract.interface.encodeFunctionData('setDetails', [
          ssn, name, phone, gender, dob, homeaddr, bloodgroup, allergies, medication
        ]);

        const transactionParameters = {
          gasLimit: ethers.BigNumber.from(gasLimit),
          gasPrice,
          data: encodedParameters,
        };
  
        const transactionResponse = await signer.sendTransaction({
          ...transactionParameters,
          to: contractAddress,
        });
    
        const receipt = await transactionResponse.wait();
        console.log('Transaction mined:', receipt.transactionHash);
    
        // Additional processing or logging if needed
    
        setLoading(false);
        setError('');
      } catch (error) {
        console.error('Transaction failed:', error.message);
        setLoading(false);
        setError('Failed to submit medical record. Error: ' + error.message);
      }
    };
  
    return (
    <div>
      <h1>Medical Record Submission</h1>
      <form>
        <label htmlFor="ssn">SSN:</label>
        <input type="number" id="ssn" value={ssn} onChange={(e) => setSSN(e.target.value)} required />

        <label htmlFor="name">Name:</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />

        <label htmlFor="Phone">Phone:</label>
        <input type="number" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />

        <label htmlFor="gender">Gender:</label>
        <input type="text" id="gender" value={gender} onChange={(e) => setGender(e.target.value)} required />
        
        <label htmlFor="dob">Dob:</label>
        <input type="date" id="dob" value={dob} onChange={(e) => setDob(e.target.value)} required />
        
        <label htmlFor="homeaddr">Homeaddr :</label>
        <input type="text" id="homeaddr" value={homeaddr} onChange={(e) => setHomeaddr(e.target.value)} required />

        <label htmlFor="bloodgroup">Bloodgroup:</label>
        <input type="text" id="bloodgroup" value={bloodgroup} onChange={(e) => setBloodgroup(e.target.value)} required />

        <label htmlFor="allergies">Allergies:</label>
        <input type="text" id="allergies" value={allergies} onChange={(e) => setAllergies(e.target.value)} required />

        <label htmlFor="medication">Medication:</label>
        <input type="text" id="medication" value={medication} onChange={(e) => setMedication(e.target.value)} required />

        <button type="button" onClick={submitMedicalRecord}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default SetDetails;