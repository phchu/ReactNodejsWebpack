import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import { SIGN_IN } from '../../queries/user';

const LoginForm = ({ refetch }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const initialValidation = { status: '' as any, help: '' };
  const [validation, setValidation] = useState(initialValidation);
  
  useEffect(() => {
    setValidation(initialValidation);
  }, [location.pathname]);

  const [signin, { loading }] = useMutation(SIGN_IN);

  const onFinish = async (input) => {
    setValidation({ status: 'validating', help: 'Please wait...' });
    try {
      const { data } = await signin({ variables: { input } });
      localStorage.setItem('token', data.signin.token);
      await refetch();
      navigate('/');
    } catch (error: any) {
      setValidation({
        status: 'error',
        help: error.graphQLErrors?.[0]?.message || error.message
      });
    }
  };

  const grid = { xs: { span: 24 }, sm: { span: 20 }, md: { span: 16 }, lg: { span: 12 } };
  
  return (
    <Row justify="center" align="middle" style={{ margin: '10%' }}>
      <Col {...grid}>
        <Card title="Sign In">
          <Form form={form} onFinish={onFinish}>
            <Form.Item name="email" rules={[{ required: true, message: 'Please input your Email!', type: 'email' }]}>
              <Input prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!', min: 6 }]}>
              <Input prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
            </Form.Item>
            <Form.Item validateStatus={validation.status} help={validation.help}>
              <Button loading={loading} type="primary" htmlType="submit" style={{ width: '100%' }}>
                Sign In
              </Button>
              No account?
              <a href="/signup" style={{ marginLeft: '5px' }}>
                Sign up now!
              </a>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

LoginForm.propTypes = {
  refetch: PropTypes.func.isRequired
};

export default LoginForm;
