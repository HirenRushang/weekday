import { useState, useEffect, useRef } from "react";
import JobCard from "./component/job_card";
import { applyFilters } from "./component/logic/filter";
import FilterContainer from "./component/filterContainer";
import {
  roleOptions,
  experienceOptions,
  locationOptions,
  basePayOptions,
} from "./component/data/filterData";
import {
  handleRoleChange,
  handleExperienceChange,
  handleSearch,
  handleLocationChange,
  handleMinBasePay,
} from "./component/logic/filterHandler";



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
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedMinBasePay, setSelectedMinBasePay] = useState("");
  const [totalCount, setTotalCount] = useState();
  const jobCardContainerRef = useRef();
  const [jobData, setjobData] = useState(null);
  const [error, setError] = useState(false);
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

  const handleFilterChange = (filterName, value) => {
    setFilterCriteria((prevState) => ({
      ...prevState,
      [filterName]: value,
    }));
  };

  const filteredJobs = applyFilters(jobData, filterCriteria, searchQuery);
  const handleRoleChangeWrapper = (selectedOptions) => {
    handleRoleChange(selectedOptions, setFilterCriteria, setSelectedRole);
  };

  const handleLocationChangeWrapper = (selectedOptions) => {
    handleLocationChange(
      selectedOptions,
      setFilterCriteria,
      setSelectedLocation
    );
  };

  const handleExperienceChangeWrapper = (selectedOption, actionMeta) => {
    handleExperienceChange(
      selectedOption,
      actionMeta,
      setSelectedExperience,
      handleFilterChange
    );
  };

  const handleMinBasePayWrapper = (selectedOption, actionMeta) => {
    handleMinBasePay(
      selectedOption,
      actionMeta,
      setSelectedMinBasePay,
      handleFilterChange
    );
  };

  const handleSearchWrapper = (event) => {
    handleSearch(event, setSearchQuery, handleFilterChange);
  };

  return (
    <>
      {error ? (
        <div className="showerror">Something went wrong</div>
      ) : (
        <>
          <FilterContainer
            roleOptions={roleOptions}
            experienceOptions={experienceOptions}
            basePayOptions={basePayOptions}
            locationOptions={locationOptions}
            handleRoleChange={handleRoleChangeWrapper}
            handleExperienceChange={handleExperienceChangeWrapper}
            handleMinBasePay={handleMinBasePayWrapper}
            handleLocationChange={handleLocationChangeWrapper}
            handleSearch={handleSearchWrapper}
          />

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
