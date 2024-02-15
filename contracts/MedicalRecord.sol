// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


contract MedicalRecord {
    // Events
    event PatientDetailsSet(address indexed patientAddress, uint256 ssn, string name, uint256 phone, string gender, string dob, string homeaddr, string bloodgroup, string allergies, string medication);
    event DoctorDetailsSet(address indexed doctorAddress, uint256 ic, string name, uint256 phone, string gender, string dob, string qualification, string major);
    event AppointmentSet(address indexed patientAddress, address indexed doctorAddress, string date, string time, string diagnosis, string prescription, string description, string status);
    event PermissionGranted(address indexed patientAddress, address indexed grantedAddress);
    event PermissionRevoked(address indexed patientAddress, address indexed revokedAddress);

    struct Patient {
        bytes32 hashedData;
        uint256 date;
    }

    struct Doctor {
        uint256 ic;
        string name;
        uint256 phone;
        string gender;
        string dob;
        string qualification;
        string major;
        uint256 date;
    }

    struct Appointment {
        address doctorAddr;
        address patientAddr;
        string date;
        string time;
        string prescription;
        string description;
        string diagnosis;
        string status;
        uint256 creationDate;
    }

    address public owner;
    address[] public patientList;
    address[] public doctorList;
    address[] public appointmentList;

    mapping(address => Patient) public patients;
    mapping(address => Doctor) public doctors;
    mapping(address => Appointment) public appointments;

    mapping(address => mapping(address => bool)) public isApproved;
    mapping(address => bool) public isPatient;
    mapping(address => bool) public isDoctor;
    mapping(address => uint256) public appointmentsPerPatient;

    uint256 public patientCount;
    uint256 public doctorCount;
    uint256 public appointmentCount;
    uint256 public permissionGrantedCount;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier onlyPatient() {
        require(isPatient[msg.sender], "Only patients can call this function");
        _;
    }

    modifier onlyDoctor() {
        require(isDoctor[msg.sender], "Only doctors can call this function");
        _;
    }

    modifier patientExists(address patientAddress) {
        require(isPatient[patientAddress], "Patient does not exist");
        _;
    }

    modifier doctorExists(address doctorAddress) {
        require(isDoctor[doctorAddress], "Doctor does not exist");
        _;
    }

    receive() external payable {
        revert("Ether not accepted");
    }

    fallback() external payable {
        revert("Fallback function not allowed");
    }

    constructor() {
        owner = msg.sender;
    }

    function hashPatientData(
        uint256 _ssn,
        string memory _name,
        uint256 _phone,
        string memory _gender,
        string memory _dob,
        string memory _homeaddr,
        string memory _bloodgroup,
        string memory _allergies,
        string memory _medication
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_ssn, _name, _phone, _gender, _dob, _homeaddr, _bloodgroup, _allergies, _medication));
    }

        function setDetails(
        uint256 _ssn,
        string memory _name,
        uint256 _phone,
        string memory _gender,
        string memory _dob,
        string memory _homeaddr,
        string memory _bloodgroup,
        string memory _allergies,
        string memory _medication

    ) public  {
        require(!isPatient[msg.sender], "Patient details already set");
        // Hash sensitive data before storing it
        bytes32 hashedData = hashPatientData(_ssn, _name, _phone, _gender, _dob, _homeaddr, _bloodgroup, _allergies, _medication);

        Patient storage p = patients[msg.sender];

        // Only update if there are changes
        require(p.hashedData != hashedData, "No changes to patient details");

        p.hashedData = hashedData;
        p.date = block.timestamp;

        patientList.push(msg.sender);
        isPatient[msg.sender] = true;
        isApproved[msg.sender][msg.sender] = true;
        patientCount++;

        emit PatientDetailsSet(msg.sender, _ssn, _name, _phone, _gender, _dob, _homeaddr, _bloodgroup, _allergies, _medication);
    }
    
        function editDetails(
        uint256 _ssn,
        string memory _name,
        uint256 _phone,
        string memory _gender,
        string memory _dob,
        string memory _homeaddr,
        string memory _bloodgroup,
        string memory _allergies,
        string memory _medication
    ) public onlyPatient patientExists(msg.sender) {
        Patient storage p = patients[msg.sender];

        // Hash sensitive data before updating it
        bytes32 newHashedData = hashPatientData(_ssn, _name, _phone, _gender, _dob, _homeaddr, _bloodgroup, _allergies, _medication);

        require(p.hashedData != newHashedData, "No changes to patient details");

        p.hashedData = newHashedData;
    }

    function setDoctor(uint256 _ic, string memory _name, uint256 _phone, string memory _gender, string memory _dob, string memory _qualification, string memory _major) public {
        require(!isDoctor[msg.sender], "Doctor details already set");

        Doctor storage d = doctors[msg.sender];

        d.ic = _ic;
        d.name = _name;
        d.phone = _phone;
        d.gender = _gender;
        d.dob = _dob;
        d.qualification = _qualification;
        d.major = _major;
        d.date = block.timestamp;

        doctorList.push(msg.sender);
        isDoctor[msg.sender] = true;
        doctorCount++;

        emit DoctorDetailsSet(msg.sender, _ic, _name, _phone, _gender, _dob, _qualification, _major);
    }

    function editDoctor(uint256 _ic, string memory _name, uint256 _phone, string memory _gender, string memory _dob, string memory _qualification, string memory _major) public onlyDoctor doctorExists(msg.sender) {
        Doctor storage d = doctors[msg.sender];

        d.ic = _ic;
        d.name = _name;
        d.phone = _phone;
        d.gender = _gender;
        d.dob = _dob;
        d.qualification = _qualification;
        d.major = _major;
    }

    function setAppointment(address _addr, string memory _date, string memory _time, string memory _diagnosis, string memory _prescription, string memory _description, string memory _status) public  {
        require(bytes(_date).length > 0, "Date must be provided");

        Appointment storage a = appointments[_addr];

        a.doctorAddr = msg.sender;
        a.patientAddr = _addr;
        a.date = _date;
        a.time = _time;
        a.diagnosis = _diagnosis;
        a.prescription = _prescription;
        a.description = _description;
        a.status = _status;
        a.creationDate = block.timestamp;

        appointmentList.push(_addr);
        appointmentCount++;
        appointmentsPerPatient[_addr]++;

        emit AppointmentSet(_addr, msg.sender, _date, _time, _diagnosis, _prescription, _description, _status);
    }

    function updateAppointment(address _addr, string memory _date, string memory _time, string memory _diagnosis, string memory _prescription, string memory _description, string memory _status) public onlyDoctor {
        Appointment storage a = appointments[_addr];

        a.doctorAddr = msg.sender;
        a.patientAddr = _addr;
        a.date = _date;
        a.time = _time;
        a.diagnosis = _diagnosis;
        a.prescription = _prescription;
        a.description = _description;
        a.status = _status;
    }

    function givePermission(address _address) public onlyPatient returns (bool success) {
        isApproved[msg.sender][_address] = true;
        permissionGrantedCount++;
        emit PermissionGranted(msg.sender, _address);
        return true;
    }

    function revokePermission(address _address) public onlyPatient returns (bool success) {
        isApproved[msg.sender][_address] = false;
        emit PermissionRevoked(msg.sender, _address);
        return true;
    }

    function getPatients() public view returns (address[] memory) {
       require(patientList.length > 0, "No patients found");
       return patientList;
    }


    function getDoctors() public view returns (address[] memory) {
        require(doctorList.length > 0, "No doctors found");
        return doctorList;
    }

    function getAppointments() public view returns (address[] memory) {
        require(appointmentList.length > 0, "No appointments found");
        return appointmentList;
    }


}
