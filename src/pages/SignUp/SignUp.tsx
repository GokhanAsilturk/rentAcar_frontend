import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Form, Input, Button, Typography, Alert, Select } from "antd";
import {
  GoogleOutlined,
  FacebookOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";
import signup from "../../assets/videos/signup.mp4";
import { useAppDispatch } from "../../store/useAppDispatch";
import { addCustomer } from "../../store/slices/customerSlice";
import { AddCustomerModel } from "../../models/Requests/Customer/AddCustomerModel";
import { useAppSelector } from "../../store/useAppSelector";
import { fetchDrivingLicenseTypes } from "../../store/slices/drivingLicenseTypeSlice";
import useToken from "antd/es/theme/useToken";
import { RootState } from "../../store/configureStore";

const SignUp = () => {
  const dispatch = useAppDispatch();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>();
  const errorCustom = useAppSelector(
    (state: RootState) => state.customer.error
  );
  const drivingLicenseTypeState = useAppSelector(
    (state: any) => state.drivingLicenseType
  );

  const [drivingLicenseTypeEntityId, setDrivingLicenseTypeEntityId] = useState<
    number | undefined
  >(undefined);
  const handleSelectChange = (value: number | undefined) => {
    setDrivingLicenseTypeEntityId(value);
  };

  useEffect(() => {
    dispatch(fetchDrivingLicenseTypes());
  }, [dispatch]);

  const handleSubmit = async (values: AddCustomerModel) => {
    try {
      await dispatch(
        addCustomer({
          name: values.name,
          surname: values.surname,
          emailAddress: values.emailAddress,
          password: values.password,
          phoneNumber: values.phoneNumber,
          drivingLicenseNumber: values.drivingLicenseNumber,
          drivingLicenseTypeEntityId: values.drivingLicenseTypeEntityId,
          userImageEntityId: 4,
        })
      );
      setSuccessMessage("Kayıt işlemi başarılı. Giriş yapabilirsiniz.");
      window.location.href = "/";
    } catch (error) {
      console.error("Kayıt işlemi başarısız oldu: ", error);
      setErrorMessage(
        "Kayıt işlemi başarısız oldu. Lütfen bilgilerinizi kontrol edin."
      );
    }
  };

  return (
    <Row
      style={{
        height: "72vh",
        width: "65vw",
        margin: "70px auto auto auto",
      }}
    >
      <Col span={24} style={{ position: "relative" }}>
        <video
          autoPlay
          loop
          muted
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            minWidth: "100%",
            minHeight: "100%",
            zIndex: 4,
            borderBottomRightRadius: "50px",
            borderTopRightRadius: "50px",
            borderBottomLeftRadius: "50px",
            borderTopLeftRadius: "50px",
            filter: "blur(3px)",
          }}
        >
          <source src={signup} type="video/mp4" />
        </video>

        <Col
          span={24}
          style={{
            position: "relative",
            zIndex: 5,
            padding: "50px",
            borderBottomRightRadius: "50px",
            borderTopRightRadius: "50px",
            borderBottomLeftRadius: "50px",
            borderTopLeftRadius: "50px",
            backgroundImage: "rgb(30 30 30 / 58%)",
          }}
        >
          <Typography.Title level={2} style={{ color: "white" }}>
            Hoş Geldiniz!
          </Typography.Title>
          <Form name="signup" onFinish={handleSubmit} layout="vertical">
            <Col
              span={24}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Col span={12} style={{ paddingRight: "10px" }}>
                {/* Sol taraftaki inputlar */}
                <Form.Item
                  label="Ad"
                  name="name"
                  rules={[
                    { required: true, message: "Lütfen adınızı girin!" },
                    {
                      pattern: /^[a-zA-ZığüşöçĞÜŞİÖÇ]+$/,
                      message: "İsim sadece harflerden oluşmalıdır",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Soyad"
                  name="surname"
                  rules={[
                    { required: true, message: "Lütfen soyadınızı girin!" },
                    {
                      pattern: /^[a-zA-ZığüşöçĞÜŞİÖÇ]+$/,
                      message: "Soyisim sadece harflerden oluşmalıdır",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="E-posta"
                  name="emailAddress"
                  rules={[
                    {
                      required: true,
                      message: "Lütfen e-posta adresinizi girin!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Telefon Numarası"
                  name="phoneNumber"
                  rules={[
                    {
                      required: true,
                      message: "Lütfen telefon numaranızı girin!",
                    },
                    {
                      pattern: /^[0-9]+$/,
                      message: "Telefon numarası sadece sayılardan oluşmalıdır",
                    },
                    { len: 10, message: "Telefon numarası 10 hane olmalıdır" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12} style={{ paddingLeft: "10px" }}>
                {/* Sağ taraftaki inputlar */}
                <Form.Item
                  label="Ehliyet Numarası"
                  name="drivingLicenseNumber"
                  rules={[
                    {
                      required: true,
                      message: "Lütfen ehliyet numarası girin!",
                    },
                    {
                      len: 6,
                      message: "Ehliyet seri numarası 6 haneli olmalıdır",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Ehliyet Tipi"
                  name="drivingLicenseTypeEntityId"
                  rules={[
                    { required: true, message: "Lütfen ehliyet tipini seçin!" },
                  ]}
                >
                  <Select
                    onChange={handleSelectChange}
                    style={{ width: "100%" }}
                    placeholder="Ehliyet Tipi Seçiniz"
                  >
                    {drivingLicenseTypeState.drivingLicenseTypes.map(
                      (drivingLicenseType: any) => (
                        <Select.Option
                          key={drivingLicenseType.id}
                          value={drivingLicenseType.id}
                        >
                          {drivingLicenseType.name}
                        </Select.Option>
                      )
                    )}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Şifre"
                  name="password"
                  rules={[
                    { required: true, message: "Lütfen şifrenizi girin!" },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              </Col>
            </Col>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ float: "right", width: "150px" }}
              >
                Kayıt Ol
              </Button>
            </Form.Item>
          </Form>
          <div
            style={{ width: "236px", marginTop: "20px", marginLeft: "36px" }}
          >
            {errorCustom && (
              <Alert type="error" message={errorCustom} showIcon />
            )}
            {!errorCustom && successMessage && (
              <Alert type="success" message={successMessage} showIcon />
            )}
          </div>
        </Col>
      </Col>
    </Row>
  );
};

export default SignUp;
