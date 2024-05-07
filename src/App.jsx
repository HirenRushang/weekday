import { useState, useEffect, useRef } from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import JobCard from "./component/job_card";
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
// import { faHourGlassEnd} from "@fortawesome/free-solid-svg-icons"
import Dropdown from "./component/dropdown";

function App() {
  const [filterCriteria, setFilterCriteria] = useState({
    jobRole: "",
    exp: "",
    location: "",
    minBasePay: "",
  });

  const [selectedRole, setSelectedRole] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedMinBasePay, setSelectedMinBasePay] = useState("");
  const [totalCount, setTotalCount] = useState();
  const jobCardContainerRef = useRef();

  const [jobData, setjobData] = useState(null);
  const [error, setError] = useState(null);
 
  
  const [loading, setLoading] = useState(false);
  const [endOfList, setEndOfList] = useState(false);

  
  

  
useEffect(() => {
    let offset = 0;
    let hasReached70Percent = false;
  
    const fetchData = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
  
        const body = JSON.stringify({
          limit: 10,
          offset: offset,
        });
  
        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body,
        };
  
        const response = await fetch(
          "https://api.weekday.technology/adhoc/getSampleJdJSON",
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
  
        const result = await response.json();
        setjobData((prevJobData) => [...(prevJobData || []), ...result.jdList]);
        setTotalCount(result.totalCount)
      } catch (error) {
        setError(error.message);
      }
    };
  
    fetchData(); // Initial call to fetch data
  
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
  
      const scrollPercentage = (scrollPosition / (documentHeight - windowHeight)) * 100;
  
      if (scrollPercentage >= 70 && !hasReached70Percent) {
        hasReached70Percent = true;
        offset += 10; // Increment offset by 10
        fetchData(); // Fetch data with new offset
      }
  
      // Reset hasReached70Percent flag when scroll percentage is below 70
      if (scrollPercentage < 70) {
        hasReached70Percent = false;
      }
  
      // Stop making API calls when offset reaches total count
      if (offset >= totalCount) {
        setEndOfList(true)
        window.removeEventListener("scroll", handleScroll);
      }
    };
  
    window.addEventListener("scroll", handleScroll);
  
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  

  
  const roleOptions = ["frontend", "Backend Developer", "Full Stack Developer"];

  const experienceOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  const locationOptions = ["Hybrid", "Remote", "In-Office"];
  const basePayOptions = ["0", "10L", "20L", "30L", "40L", "50L", "60L", "70L"];
  const handleFilterChange = (filterName, value) => {
    setFilterCriteria((prevState) => ({
      ...prevState,
      [filterName]: value,
    }));
  };

  const filteredJobs =
    jobData && jobData.length > 0
      ? jobData.filter((job) => {
          // Apply filters
          const roleFilter =
            filterCriteria.jobRole === "" ||
            job.jobRole === filterCriteria.jobRole;
          const expFilter =
            filterCriteria.exp === "" ||
            (job.minExp && job.minExp.toString() === filterCriteria.exp);
          const basePay =
            filterCriteria.minBasePay === "" ||
            (job.minJdSalary && filterCriteria.minBasePay.endsWith("L")
              ? parseInt(filterCriteria.minBasePay.slice(0, -1)) <
                job.minJdSalary
              : parseInt(filterCriteria.minBasePay) < job.minJdSalary);

          let locationFilter;
          if (filterCriteria.location === "Remote") {
            locationFilter =
              job.location && job.location.toLowerCase() === "remote";
          } else if (filterCriteria.location === "Hybrid") {
            locationFilter =
              job.location && job.location.toLowerCase() === "hybrid";
          } else {
            locationFilter =
              !job.location ||
              (job.location.toLowerCase() !== "remote" &&
                job.location.toLowerCase() !== "hybrid");
          }

          // Apply all filters
        //   
        //   return roleFilter && expFilter && locationFilter && basePay;
        const allFiltersPassed = roleFilter && expFilter && locationFilter && basePay;

        // Log filtered job data
        if (allFiltersPassed) {
          console.log(`job ${allFiltersPassed}`); // Log the filtered job
        }

        return allFiltersPassed;

          
        })
      : [];

  const handleRoleChange = (event) => {
    handleFilterChange("jobRole", event.target.value);
    setSelectedRole(event.target.value);
   
  };

  const handleLocationChange = (event) => {
    handleFilterChange("location", event.target.value);
    setSelectedLocation(event.target.value);
  };

  const handleExperienceChange = (event) => {
    handleFilterChange("exp", event.target.value);

    setSelectedExperience(event.target.value);
  };

  const handleMinBasePay = (event) => {
    handleFilterChange("minBasePay", event.target.value);

    setSelectedMinBasePay(event.target.value);
  };

  return (
    <>
      <div className="filtercontainer">
      
        <Dropdown
          options={roleOptions}
          value={selectedRole}
          onChange={handleRoleChange}
          defaultOptionText="Role"
        />
        <Dropdown
          options={experienceOptions}
          value={selectedExperience}
          onChange={handleExperienceChange}
          defaultOptionText="Experiance"
        />

        <Dropdown
          options={locationOptions}
          value={selectedLocation}
          onChange={handleLocationChange}
          defaultOptionText="Location"
        />
        <Dropdown
          options={basePayOptions}
          value={selectedMinBasePay}
          onChange={handleMinBasePay}
          defaultOptionText="Minimum Base Pay Salary"
        />
      </div>

      <div className="listedjob" ref={jobCardContainerRef}>
        {jobData === null ? (
          <div>Loading...</div>
        ) : filteredJobs.length === 0 ? (
          <div>No jobs found based on the selected filters.</div>
        ) : (
            filteredJobs.map((job, index) => <JobCard key={`${job.jdUid}-${index}`} job={job} />)

        //   filteredJobs.map((job) => <JobCard key={job.jdUid} job={job} />)
        )}
        {loading && <div>Loading more...</div>}
        {endOfList && <div>No more jobs to load.</div>}
      </div>
    </>
  );
}

export default App;
