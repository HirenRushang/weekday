import React from 'react';
import Button from './button'; // Assuming Button component file path




const JobCard = ({ job }) => {
  const {
    logoUrl,
    companyName,
    jobRole,
    location,
    minJdSalary,
    maxJdSalary,
    jobDetailsFromCompany,
    jdLink,
    minExp,
  } = job;



  return (
    <div className='job-card'  >
      
      <div className='company-intro'>
        <div className='company-logo'>
          <img src={logoUrl} alt="Company Logo" height={40} width={40} />
        </div>
        <div className='company-title'>
          <p>{companyName}</p>
          <p>{jobRole}</p>
          <p>{location}</p>
        </div>
      </div>
      <div className='salary-info'>Estimated salary: {minJdSalary} - {maxJdSalary}</div>
      <div  style={{ fontSize: '16px', fontWeight: '500' }}>About company:</div>
      <div  style={{ fontSize: '14px', fontWeight: 'bold' }}>About us</div>
      <div className='details'>{jobDetailsFromCompany}</div>
      <div className='view-job' style={{ cursor: 'pointer'}} onClick={() => window.open(jdLink, '_blank')}>View Job</div>
      {minExp ? (
        <div className='min-experiance'>
          <div >Minimum Experience</div>
          <div>{`${minExp} Years`}</div>
        </div>
      ) : (<div style={{height:"59px"}}></div>)}
      
      <Button text="Easy Apply" color="#55EFC4" textColor="black" fWeight="500" />
      <Button text="Unlock referral ask" color="#4943DA" textColor="white" />
    </div>
  );
};

export default JobCard;
