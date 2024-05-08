export const applyFilters = (jobData, filterCriteria, searchQuery) => {
    if (!jobData || jobData.length === 0) return [];
  
    return jobData.filter((job) => {
      const isSearchQueryEmpty = searchQuery.trim() === "";
      const companyNameFilter =
        isSearchQueryEmpty ||
        job.companyName.toLowerCase().includes(searchQuery.toLowerCase().trim());
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
        (job.minJdSalary &&
          filterCriteria.minBasePay.endsWith("L")
          ? parseInt(filterCriteria.minBasePay.slice(0, -1)) < job.minJdSalary
          : parseInt(filterCriteria.minBasePay) < job.minJdSalary);
  
      let locationFilter;
      if (filterCriteria.location) {
        const selectedLocations = filterCriteria.location.split(",");
        if (selectedLocations.includes("In-Office")) {
          locationFilter =
            !job.location ||
            (job.location.toLowerCase() !== "remote" &&
              job.location.toLowerCase() !== "hybrid");
        } else {
          locationFilter = selectedLocations.some((selectedLocation) => {
            if (selectedLocation === "Remote") {
              return job.location && job.location.toLowerCase() === "remote";
            } else if (selectedLocation === "Hybrid") {
              return job.location && job.location.toLowerCase() === "hybrid";
            }
            return (
              job.location &&
              job.location.toLowerCase() === selectedLocation.toLowerCase()
            );
          });
        }
      } else {
        locationFilter = true;
      }
  
      const allFiltersPassed =
        roleFilter && expFilter && locationFilter && basePay && companyNameFilter;
  
      return allFiltersPassed;
    });
  };
  