import React, { useEffect, useState } from "react";
import { AddShowRentalResponse } from "../../models/Responses/Rental/AddShowRentalResponse";
import { addShowRental } from "../../store/slices/showRentalSlice";
import { AppDispatch } from "../../store/configureStore";
import { useDispatch } from "react-redux";

import "./ShowRental.css";
import "./DiscountInput.css";
import ShowCarCard from "../ShowRentalCarCard/ShowCarCard";
import Title from "antd/es/typography/Title";
const ShowRental: React.FC<{
  response: AddShowRentalResponse | undefined;
  onPaymentProcessClick: () => void;
}> = ({ response, onPaymentProcessClick }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [discountCodeInput, setDiscountCodeInput] = useState("");
  const [calculatedAmount, setCalculatedAmount] = useState<number | undefined>(
    undefined
  );

  const [rentalResponse, setRentalResponse] = useState<
    AddShowRentalResponse | undefined
  >();

  if (!response) {
    return <div>Bilgiler yükleniyor...</div>;
  }
  /* tarihi reformat etmek */
  const formatDate = (tarih: Date | string) => {
    const dateObject = new Date(tarih);
    if (dateObject instanceof Date && !isNaN(dateObject.getTime())) {
      const gun = dateObject.getDate().toString().padStart(2, "0");
      const ay = (dateObject.getMonth() + 1).toString().padStart(2, "0");
      const yil = dateObject.getFullYear().toString();
      return `${gun}.${ay}.${yil}`;
    } else {
      return "Geçersiz Tarih";
    }
  };

  const calculateTotalDays = (startDate: Date, endDate: Date): number => {
    const oneDay = 24 * 60 * 60 * 1000;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startTime = Date.UTC(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    );
    const endTime = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

    const dayDifference = Math.round(Math.abs((startTime - endTime) / oneDay));

    return dayDifference;
  };

  const { customerResponse, carResponse, startDate, endDate, discountCode, amount } =
    response.response;

  const handleCalculateClick = async () => {
    const newAmountResponse = await dispatch(
      addShowRental({
        discountCode: discountCodeInput,
        carEntityId: carResponse.id,
        startDate: startDate,
        endDate: endDate,
        customerEntityId: customerResponse.id,
      })
    );

    if (newAmountResponse.payload) {
      setRentalResponse(newAmountResponse.payload as AddShowRentalResponse);
      setCalculatedAmount(rentalResponse?.response.amount);
    }
  };

  /* const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  }; */

  return (
    <div className="show-rental-container mt-4">
        <Title>Macera Detayları</Title>
    
      <div className="line"></div>

      <div className="row">
        <div className="col-md-4">
          <div>
            {response && response.response.carResponse && (
              <ShowCarCard carDTO={response.response.carResponse} />
            )}
          </div>
        </div>

        <div className="col-md-4">
          <div className="text-white">
            <h5 className="second-header">Müşteri Bilgileri:</h5>
            <div className="customer-info-container">
              <div className="label-value-pair">
                <div>
                  <p>Ad:</p>
                  <p>Soyad:</p>
                  <p>Mail Adresi:</p>
                  <p>İletişim Numarası:</p>
                  <p>Ehliyet Tipi:</p>
                </div>
              </div>
              <div className="customer-values text-grey">
                <div>
                  <p>{customerResponse.name}</p>
                  <p>{customerResponse.surname}</p>
                  <p>{customerResponse.emailAddress}</p>
                  <p>{customerResponse.phoneNumber}</p>
                  <p>{customerResponse.drivingLicenseTypeEntityName}</p>
                </div>
              </div>
            </div>
            
            <h5 className="second-header">Araç Bilgileri:</h5>
            <div className="car-info-container">
              <div className="label-value-pair text-grey">
                <p>Marka:</p>
                <p>Model:</p>
                <p>Renk:</p>
                <p>Yıl:</p>
              </div>
              <div className="car-info-values">
                <div>
                  <p>{carResponse.carModelEntityBrandEntityName}</p>
                  <p>{carResponse.carModelEntityName}</p>
                  <p>{carResponse.colorEntityName}</p>
                  <p>{carResponse.year}</p>
                </div>
              </div>
            </div>

            
          </div>
          <h4 className="second-header-center" >Macera Tarihleri</h4>
            <div className="rental-dates-container">
              <div className="rental-date-values">
                {formatDate(startDate)} - {formatDate(endDate)}
              </div>
            </div>
          {/* İndirim Kodu ve Hesapla Butonu */}
          <div className="mb-3 asd">
            {/* Fiyat*/}
            <div style={{ float: "left", marginTop:'auto'}}>
              <p style={{ color: "white" }}>
                <strong
                  style={{
                    alignSelf: "flex-start",
                    color: "white",
                    alignItems: "center",
                  }}
                >
                  {calculateTotalDays(startDate, endDate)}
                </strong>{" "}
                Günlük fiyat:
                <strong style={{ color: "white" , fontSize:'20px'}}>
                  {" "}
                  {calculatedAmount !== undefined
                    ? calculatedAmount
                    : amount}{" "}
                  TL
                </strong>
              </p>
            </div>

            <div>
            <div className="input-container">
              <input
                value={discountCodeInput}
                onChange={(e) =>
                  setDiscountCodeInput(e.target.value.toUpperCase().trim())
                }
                className="custom-input"
                placeholder="indirim kodu"
                style={{ width: "210px", height: "50px",color:"black" }}
              ></input>
              <button onClick={handleCalculateClick} className="discountButton">Uygula</button>
            </div>
          </div>
          </div>

          {/* checkbboxes */}
          <div>
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="termsCheckbox"
                /* checked={isChecked}
        onChange={handleCheckboxChange} */
                className="checkbox-input"
              />
              <label htmlFor="termsCheckbox" className="checkbox-label">
                ExtendRent
                <a
                  href="/link/to/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  kullanım şartlarını
                </a>{" "}
                okudum, anladım, kabul ediyorum.
              </label>
            </div>

            <div className="checkbox-container">
              <input
                type="checkbox"
                id="termsCheckbox"
                /* checked={isChecked}
        onChange={handleCheckboxChange} */
                className="checkbox-input"
              />
              <label htmlFor="termsCheckbox" className="checkbox-label">
                <a
                  href="/link/to/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Kiralama koşullarını
                </a>{" "}
                okudum, anladım, kabul ediyorum.
              </label>
            </div>
          </div>
        </div>
        <button onClick={onPaymentProcessClick} className="mt-2 pay-button">
          Ödemeye İlerle
        </button>
      </div>
    </div>
  );
};

export default ShowRental;
