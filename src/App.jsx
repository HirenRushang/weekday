import { useState, useEffect, useRef } from "react";
import JobCard from "./component/job_card";
import Select from "react-select";

function App() {
  const [filterCriteria, setFilterCriteria] = useState({
    jobRole: "",
    exp: "",
    location: "",
    minBasePay: "",
    companyName: "",
  });

  const [selectedRole, setSelectedRole] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isClearable, setIsClearable] = useState(true);

  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedMinBasePay, setSelectedMinBasePay] = useState("");
  const [totalCount, setTotalCount] = useState();
  const jobCardContainerRef = useRef();

  const [jobData, setjobData] = useState(null);
  const [error, setError] = useState(false);

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
        const newJobs = result.jdList;

        // Update jobData state by merging new data with existing data
        setjobData((prevJobData) => [...(prevJobData || []), ...newJobs]);

        // // Merge new jobs with existing jobData array
        // const mergedJobs = [...(jobData || []), ...newJobs];
        // // Filter unique jobs
        // const uniqueJobs = Array.from(
        //   new Set(mergedJobs.map((job) => job.jdUid))
        // ).map((id) => mergedJobs.find((job) => job.jdUid === id));
        // // setjobData((prevJobData) => [...(prevJobData || []), ...result.jdList]);
        // setjobData(uniqueJobs);
        setTotalCount(result.totalCount);
      } catch (error) {
        setError(true);
      }
    };

    fetchData(); // Initial call to fetch data

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const scrollPercentage =
        (scrollPosition / (documentHeight - windowHeight)) * 100;

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
        setEndOfList(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const roleOptions = [
    { value: "frontend", label: "FrontEnd" },
    { value: "backend", label: "BackEnd" },
    { value: "tech lead", label: "Tech Lead" },
    { value: "data scientist", label: "Data Scientist" },
    { value: "sales executive", label: "Sales Executive" },
    { value: "hr", label: "Hr" },
    { value: "fullstack", label: "FullStack" },
  ];

  const experienceOptions = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
  ];

  const locationOptions = [
    { value: "Hybrid", label: "Hybrid" },
    { value: "Remote", label: "Remote" },
    { value: "In-Office", label: "In-Office" },
  ];

  const basePayOptions = [
    { value: "0", label: "0" },
    { value: "10L", label: "10L" },
    { value: "20L", label: "20L" },
    { value: "30L", label: "30L" },
    { value: "40L", label: "40L" },
    { value: "50L", label: "50L" },
    { value: "60L", label: "60L" },
    { value: "70L", label: "70L" },
  ];

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
          const isSearchQueryEmpty = searchQuery.trim() === "";

          // Apply company name filter only if the search query is not empty
          const companyNameFilter =
            isSearchQueryEmpty ||
            job.companyName
              .toLowerCase()
              .includes(searchQuery.toLowerCase().trim());

          const roleFilter =
            filterCriteria.jobRole.length === 0 ||
            filterCriteria.jobRole
              .split(",")
              .some((selectedRole) => job.jobRole === selectedRole.trim());

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
              if (filterCriteria.location) {
                  const selectedLocations = filterCriteria.location.split(","); // Convert comma-separated string to array of selected locations
                  if (selectedLocations.includes("In-Office")) {
                      // Show jobs that are not marked as Remote or Hybrid
                      locationFilter = !job.location || (job.location.toLowerCase() !== "remote" && job.location.toLowerCase() !== "hybrid");
                  } else {
                      locationFilter = selectedLocations.some(selectedLocation => {
                          if (selectedLocation === "Remote") {
                              return job.location && job.location.toLowerCase() === "remote";
                          } else if (selectedLocation === "Hybrid") {
                              return job.location && job.location.toLowerCase() === "hybrid";
                          }
                          // For other selected locations
                          return job.location && job.location.toLowerCase() === selectedLocation.toLowerCase();
                      });
                  }
              } else {
                  locationFilter = true; // No location filter applied, so all jobs pass
              }
              
              

          // Apply all filters
          //
          //   return roleFilter && expFilter && locationFilter && basePay;
          const allFiltersPassed =
            roleFilter &&
            expFilter &&
            locationFilter &&
            basePay &&
            companyNameFilter;

          // Log filtered job data
          if (allFiltersPassed) {
            console.log(`job ${allFiltersPassed}`); // Log the filtered job
          }

          return allFiltersPassed;
        })
      : [];

  const handleRoleChange = (selectedOptions) => {
    // Extracting values from selected options
    const selectedValues = selectedOptions.map((option) => option.value);

    // Joining selected values into a comma-separated string
    const selectedRoles = selectedValues.join(",");

    // Updating the jobRole filter criteria
    setFilterCriteria((prevState) => ({
      ...prevState,
      jobRole: selectedRoles,
    }));

    // Update the selected roles state
    setSelectedRole(selectedOptions);
  };
  const handleLocationChange = (selectedOptions) => {
    // Extracting values from selected options
    const selectedValues = selectedOptions.map((option) => option.value);

    // Joining selected values into a comma-separated string
    const selectedLocations = selectedValues.join(",");

    // Updating the location filter criteria
    setFilterCriteria((prevState) => ({
      ...prevState,
      location: selectedLocations,
    }));

    // Update the selected locations state
    setSelectedLocation(selectedOptions);
};


  const handleExperienceChange = (selectedOption, actionMeta) => {
    // Extract the value from the selected option
    if(actionMeta.action === "clear"){
      setSelectedExperience("")
      handleFilterChange("exp", "");
      return;
      
    }
    const selectedValue = selectedOption.value;

    // Update the filter criteria and selected experience state
    handleFilterChange("exp", selectedValue);
    setSelectedExperience(selectedValue);
  };

  const handleMinBasePay = (selectedOption, actionMeta) => {
    // Extract the value from the selected 
    
   
    if(actionMeta.action === "clear"){
      setSelectedMinBasePay("")
      handleFilterChange("minBasePay", "");
      return;
      
    }
    const selectedValue = selectedOption.value;
    

    // Update the filter criteria and selected minimum base pay state
    handleFilterChange("minBasePay", selectedValue);
    setSelectedMinBasePay(selectedValue);
  };

  const handleSearch = (event) => {
    // Extract the value from the selected option
    const selectedValue = event.target.value;

    console.log(`selected value ${selectedValue}`);

    // Update the filter criteria and selected minimum base pay state
    handleFilterChange("companyName", selectedValue);
    setSearchQuery(selectedValue);
  };

  return (
    <>
      {error ? (
        <div className="showerror">Something went wrong</div>
      ) : (
        <>
          <div className="filtercontainer">
            <Select
              options={roleOptions}
              isMulti
              onChange={handleRoleChange}
              placeholder={" Roles... "}
            />
            <Select
            isClearable={true}
              options={experienceOptions}
              onChange={handleExperienceChange}
              placeholder={" Experiance... "}
            />
            <Select
            isClearable={true}
              options={basePayOptions}
              onChange={handleMinBasePay}
              placeholder={" Minimum base pay... "}
              />
              
           
             
            
            
   
            <Select
             
              options={locationOptions}
              onChange = {handleLocationChange}
              placeholder={" Location... "}
              isMulti={true}
           
              
  
          
    
             
              
            />
            <input
              type="text"
              placeholder="Search company name"
              className="search-input"
              onChange={handleSearch}
            />
          </div>

          <div className="listedjob" ref={jobCardContainerRef}>
            {jobData === null && !error ? (
              <div className="loading">Loading...</div>
            ) : filteredJobs.length === 0 && !error ? (
              <div className="nodata">
                No jobs found based on the selected filters.
              </div>
            ) : (
              filteredJobs.map((job, index) => (
                <JobCard key={`${job.jdUid}-${index}`} job={job} />
              ))

              //   filteredJobs.map((job) => <JobCard key={job.jdUid} job={job} />)
            )}
          </div>
        </>
      )}
    </>
  );
}

export default App;
