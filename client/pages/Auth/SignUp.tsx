import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Input, Result, Row } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';
import _ from 'lodash';
import PropTypes from 'prop-types';

import { SIGN_UP } from '../../queries/user';
import { SIGN_UP as SIGN_UP_ACTION } from '../../store/auth';
import { useStore } from '../../store';

const RegisterForm = ({ refetch }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const initialValidation = { status: '' as any, help: '' };
  const [validation, setValidation] = useState(initialValidation);
  const [{ auth }, dispatch] = useStore();
  const user = _.get(auth, 'user._id');
  
  useEffect(() => {
    setValidation(initialValidation);
  }, [location.pathname, user]);

  const [signup, { loading }] = useMutation(SIGN_UP, {
    onCompleted: data => dispatch({ type: SIGN_UP_ACTION, payload: data.signup })
  });

  const onFinish = async (input) => {
    setValidation({ status: 'validating', help: 'Please wait...' });
    try {
      await signup({ variables: { input } });
      navigate('/signup');
    } catch (error: any) {
      setValidation({
        status: 'error',
        help: error.graphQLErrors?.[0]?.message || error.message
      });
    }
  };

  const SingUpResult = () => (
    <Result
      status="success"
      title="You have signed up successfully!"
      subTitle="Please proceed to the login page."
      extra={[
        <Button
          type="primary"
          key="signup"
          onClick={() => navigate('/signin')}
        >
          Sign in
        </Button>
      ]}
    />
  );

  const grid = { xs: { span: 24 }, sm: { span: 20 }, md: { span: 16 }, lg: { span: 12 } };
  
  return (
    <div>
      {!user ? (
        <Row justify="center" align="middle" style={{ margin: '10%' }}>
          <Col {...grid}>
            <Card title="Sign up">
              <Form form={form} onFinish={onFinish}>
                <Form.Item name="name" rules={[{ required: true, message: 'Please input your user name!', min: 6 }]}>
                  <Input prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                </Form.Item>
                <Form.Item name="email" rules={[{ required: true, message: 'Please input your Email!', type: 'email' }]}>
                  <Input prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!', min: 6 }]}>
                  <Input prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                </Form.Item>
                <Form.Item validateStatus={validation.status} help={validation.help}>
                  <Button loading={loading} type="primary" htmlType="submit" style={{ width: '100%' }}>
                    Continue
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      ) : (
        <SingUpResult />
      )}
    </div>
  );
};

RegisterForm.propTypes = {
  refetch: PropTypes.func.isRequired
};

export default RegisterForm;
