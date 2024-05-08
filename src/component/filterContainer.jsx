import React from "react";
import Select from "react-select";

const FilterContainer = ({
  roleOptions,
  experienceOptions,
  basePayOptions,
  locationOptions,
  handleRoleChange,
  handleExperienceChange,
  handleMinBasePay,
  handleLocationChange,
  handleSearch,
}) => {
  return (
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
        onChange={handleLocationChange}
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
  );
};

export default FilterContainer;
