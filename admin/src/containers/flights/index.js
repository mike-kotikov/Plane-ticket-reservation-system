import React, { useState } from 'react';
import { Spinner } from 'react-bootstrap';

import FlightDetails from './FlightDetails';
import FlightAdd from './FlightAdd';
import CustomInput from '../../components/customInput';
import CustomTable from '../../components/customTable';
import CustomPagination from '../../components/customPagination';
import CustomButton from '../../components/customButton';
import CustomAlert from '../../components/customAlert';

import useFetchData from '../../hooks/useFetchData';
import useAlert from '../../hooks/useAlert';

import flightApi from '../../api/flight';

import componentStyles from '../../constants/componentStyles';

import formatFlights from '../../helpers/formatFlights';

function FlightsContainer() {
  const {
    items,
    setItems: setFlights,
    isLoading,
    searchText,
    setSearchText,
    currentPage,
    setCurrentPage,
    maxPage
  } = useFetchData(flightApi.getFlights);

  const flights = formatFlights(items);

  const { alert, setAlert, showAlert, setShowAlert } = useAlert();

  const [selectedFlight, setSelectedFlight] = useState(null);

  const [showInfoScreen, setShowInfoScreen] = useState(false);
  const [showAddScreen, setShowAddScreen] = useState(false);

  const handleClick = event => {
    const { id } = event.currentTarget;
    const selected = flights.find(flight => flight.id === +id);

    setSelectedFlight(selected);
    setShowInfoScreen(true);
  };

  const handleBack = () => {
    showInfoScreen && setShowInfoScreen(false);
    showAddScreen && setShowAddScreen(false);
  };

  const handleSearch = ({ target }) => {
    setSearchText(target.value);
  };

  const handlePagination = ({ target }) => {
    const selectedPage = +target.name || +target.parentNode.name;

    if (selectedPage) {
      setCurrentPage(selectedPage);
    }
  };

  const handleSave = async data => {
    try {
      handleBack();

      const newFlight = await flightApi.addFlight(data);

      setCurrentPage(flights.length >= resultsPerPageLimit ? maxPage + 1 : maxPage);

      if (currentPage === maxPage) {
        setFlights([...flights, newFlight]);
      }

      setAlert({
        variant: componentStyles.success,
        heading: 'Saved',
        mainText: 'Airplane was successfully saved.',
        isShown: setShowAlert
      });
    } catch (err) {
      setAlert({
        variant: componentStyles.error,
        heading: 'Not Saved',
        mainText: 'An error occured while saving airplane data.',
        isShown: setShowAlert
      });
    } finally {
      setShowAlert(true);
    }
  };

  const handleAdd = () => setShowAddScreen(true);

  const renderTable = () =>
    flights.length ? (
      <>
        <CustomTable headers={Object.keys(flights[0])} items={flights} onClick={handleClick} />
        {maxPage > 1 && (
          <CustomPagination
            currentPage={currentPage}
            lastPage={maxPage}
            isLarge={maxPage >= 10}
            handlePagination={handlePagination}
          />
        )}
      </>
    ) : (
      <h1>No Data.</h1>
    );

  const renderPage = () => (
    <>
      <CustomInput
        label="Search"
        name="flight-search"
        value={searchText}
        placeholder="Search flights"
        onChange={handleSearch}
      />
      <CustomButton variant={componentStyles.success} text="Add flight" onClick={handleAdd} />
      {isLoading ? <Spinner animation="border" variant={componentStyles.default} /> : renderTable()}
      {showAlert && <CustomAlert props={alert} />}
    </>
  );

  const renderScreen = () =>
    showInfoScreen ? (
      <FlightDetails
        name={selectedFlight.name}
        type={selectedFlight.type}
        maxLuggageCarryWeight={selectedFlight.maxLuggageCarryWeight}
        handleBack={handleBack}
      />
    ) : (
      <FlightAdd handleSave={handleSave} handleBack={handleBack} />
    );

  return showInfoScreen || showAddScreen ? renderScreen() : renderPage();
}

export default FlightsContainer;
