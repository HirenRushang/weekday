// filterHandlers.js
export const handleRoleChange = (
  selectedOptions,
  setFilterCriteria,
  setSelectedRole
) => {
  const selectedValues = selectedOptions.map((option) => option.value);
  const selectedRoles = selectedValues.join(",");

  // Updating the jobRole filter criteria
  setFilterCriteria((prevState) => ({
    ...prevState,
    jobRole: selectedRoles,
  }));

  // Update the selected roles state
  setSelectedRole(selectedOptions);
};

export const handleLocationChange = (
  selectedOptions,
  setFilterCriteria,
  setSelectedLocation
) => {
  const selectedValues = selectedOptions.map((option) => option.value);

  const selectedLocations = selectedValues.join(",");

  // Updating the location filter criteria
  setFilterCriteria((prevState) => ({
    ...prevState,
    location: selectedLocations,
  }));

  // Update the selected locations state
  setSelectedLocation(selectedOptions);
};

export const handleExperienceChange = (
  selectedOption,
  actionMeta,
  setSelectedExperience,
  handleFilterChange
) => {
  if (actionMeta.action === "clear") {
    setSelectedExperience("");
    handleFilterChange("exp", "");
    return;
  }
  const selectedValue = selectedOption.value;

  // Update the filter criteria and selected experience state
  handleFilterChange("exp", selectedValue);
  setSelectedExperience(selectedValue);
};

export const handleMinBasePay = (
  selectedOption,
  actionMeta,
  setSelectedMinBasePay,
  handleFilterChange
) => {
  // Extract the value from the selected option
  if (actionMeta.action === "clear") {
    setSelectedMinBasePay("");
    handleFilterChange("minBasePay", "");
    return;
  }
  const selectedValue = selectedOption.value;

  // Update the filter criteria and selected minimum base pay state
  handleFilterChange("minBasePay", selectedValue);
  setSelectedMinBasePay(selectedValue);
};

export const handleSearch = (event, setSearchQuery, handleFilterChange) => {
  const selectedValue = event.target.value;

  console.log(`selected value ${selectedValue}`);

  handleFilterChange("companyName", selectedValue);
  setSearchQuery(selectedValue);
};
