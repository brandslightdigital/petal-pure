import React, { useEffect, useState } from "react";
import { Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

const GlobalSettings = () => {
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/global-setting`).then((res) => {
      const data = res.data || {};
      form.setFieldsValue(data);
      setInitialValues(data);
    });
  }, [form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();

      Object.entries(values).forEach(([key, val]) => {
        formData.append(key, val);
      });

      if (logoFile) formData.append("logo", logoFile);
      if (faviconFile) formData.append("favicon", faviconFile);

      await axios.post(`${BASE_URL}/api/global-setting/update`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      message.success("Settings updated successfully!");

      // Refresh the preview
      const res = await axios.get(`${BASE_URL}/api/global-setting`);
      form.setFieldsValue(res.data);
      setInitialValues(res.data);
      setLogoFile(null);
      setFaviconFile(null);
    } catch (err) {
      console.error(err);
      message.error("Failed to save settings");
    }
  };

  const getImageUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${BASE_URL}${path}`;
  };

  return (
    <Form
      form={form}
      layout="vertical"
      style={{ maxWidth: 700, margin: "0 auto" }}
    >
      <Form.Item label="Upload Website Logo">
        <Upload
          beforeUpload={(file) => {
            setLogoFile(file);
            return false;
          }}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Upload Logo</Button>
        </Upload>
        {(logoFile || initialValues.logoUrl) && (
          <img
            src={
              logoFile
                ? URL.createObjectURL(logoFile)
                : getImageUrl(initialValues.logoUrl)
            }
            alt="Logo Preview"
            style={{ maxHeight: 80, marginTop: 10, width: 200, marginLeft: 10 }}
          />
        )}
      </Form.Item>

      <Form.Item
        label="Meta Title"
        name="metaTitle"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Meta Description"
        name="metaDescription"
        rules={[{ required: true }]}
      >
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item label="Meta Keywords" name="metaKeywords">
        <Input />
      </Form.Item>

      <Form.Item label="Upload Favicon">
        <Upload
          beforeUpload={(file) => {
            setFaviconFile(file);
            return false;
          }}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Upload Favicon</Button>
        </Upload>
        {(faviconFile || initialValues.faviconUrl) && (
          <img
            src={
              faviconFile
                ? URL.createObjectURL(faviconFile)
                : getImageUrl(initialValues.faviconUrl)
            }
            alt="Favicon Preview"
            style={{
              width: 50,
              height: 50,
              objectFit: "contain",
              marginLeft: 10,
              // border: "1px solid #ccc",
              padding: 4,
              borderRadius: 4,
              // backgroundColor: "#fff",
            }}
          />
        )}
      </Form.Item>

      <Form.Item label="OG Image URL" name="ogImageUrl">
        <Input />
      </Form.Item>

      <Form.Item label="Google Analytics Script" name="analyticsScript">
        <Input.TextArea rows={4} />
      </Form.Item>

      <Button type="primary" onClick={handleSave}>
        Save Settings
      </Button>
    </Form>
  );
};

export default GlobalSettings;
