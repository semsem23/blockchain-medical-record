const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MedicalRecord Contract", function () {
  let medicalRecord;
  let owner;
  let patient;
  let doctor;

  beforeEach(async function () {
    const MedicalRecord = await ethers.getContractFactory("MedicalRecord");
    medicalRecord = await MedicalRecord.deploy();

    // Deploy a few signers for testing
    [owner, patient, doctor] = await ethers.getSigners();

    // Print addresses for debugging purposes
    console.log("Owner Address:", await owner.getAddress());
    console.log("Patient Address:", await patient.getAddress());
    console.log("Doctor Address:", await doctor.getAddress());
  });

  it("should set patient details", async function () {
    const ssn = 123456789;
    const name = "John Doe";
    const phone = 1234567890;
    const gender = "Male";
    const dob = "01-01-1990";
    const homeaddr = "123 Main St";
    const bloodgroup = "O+";
    const allergies = "None";
    const medication = "Aspirin";

    await medicalRecord.connect(patient).setDetails(ssn, name, phone, gender, dob, homeaddr, bloodgroup, allergies, medication);

    const patientDetails = await medicalRecord.patients(patient.address);
    expect(patientDetails.hashedData).to.not.equal(0);
  });

  it("should set doctor details", async function () {
    const ic = 123456789;
    const name = "John Doe";
    const phone = 1234567890;
    const gender = "Male";
    const dob = "01-01-1990";
    const houseaddr = "123 Main St";
    const qualification = "O+";
    const major = "None";

    await medicalRecord.connect(doctor).setDoctor(ic, name, phone, gender, dob, qualification, major);

    const doctorDetails = await medicalRecord.doctors(doctor.address);
    expect(doctorDetails.ic).to.equal(ic);
    expect(doctorDetails.name).to.equal(name);
    expect(doctorDetails.phone).to.equal(phone);
    expect(doctorDetails.gender).to.equal(gender);
    expect(doctorDetails.dob).to.equal(dob);
    expect(doctorDetails.qualification).to.equal(qualification);
    expect(doctorDetails.major).to.equal(major);
  });

  it("should set appointment", async function () {
    const patientAddress = await patient.getAddress();
    const doctorAddress = await doctor.getAddress();

    const appointmentData = {
      date: "2024-02-15",
      time: "10:00 AM",
      diagnosis: "Checkup",
      prescription: "Medicine X",
      description: "Routine checkup",
      status: "Scheduled",
    };

    // Call the setAppointment function
    await medicalRecord.connect(doctor).setAppointment(
      patientAddress,
      appointmentData.date,
      appointmentData.time,
      appointmentData.diagnosis,
      appointmentData.prescription,
      appointmentData.description,
      appointmentData.status
    );

    // Retrieve the appointment details from the contract
    const appointmentDetails = await medicalRecord.appointments(patientAddress);

    // Assertions to check if the appointment details are set correctly
    expect(appointmentDetails.doctorAddr).to.equal(doctorAddress);
    expect(appointmentDetails.patientAddr).to.equal(patientAddress);
    expect(appointmentDetails.date).to.equal(appointmentData.date);
    expect(appointmentDetails.time).to.equal(appointmentData.time);
    expect(appointmentDetails.diagnosis).to.equal(appointmentData.diagnosis);
    expect(appointmentDetails.prescription).to.equal(appointmentData.prescription);
    expect(appointmentDetails.description).to.equal(appointmentData.description);
    expect(appointmentDetails.status).to.equal(appointmentData.status);
    expect(appointmentDetails.creationDate).to.not.equal(0);
  });
});