import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Icon,
  Input,
  Row
} from 'antd';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import useAuth from '../../hooks/useAuth';

const FormItem = Form.Item;

const LoginForm = ({
  history, location, form
}) => {
  const initialValidation = { status: '', help: '' };
  const [validation, setValidation] = useState(initialValidation);
  const { signIn } = useAuth();
  const { getFieldDecorator, validateFields } = form;
  useEffect(
    () => {
      setValidation(initialValidation);
    },
    [location.pathname]
  );
  const handleSubmit = (e) => {
    e.preventDefault();
    let val = { status: 'validating', help: 'Please wait...' };
    validateFields(async (err, values) => {
      if (!err) {
        setValidation(val);
        const result = await signIn(values);
        const { err: error, errMsg } = result;
        if (!error) {
          history.push('/');
        } else {
          val = { status: 'error', help: errMsg };
          setValidation(val);
        }
      }
    });
  };
  const grid = {
    xs: { span: 24 },
    sm: { span: 20 },
    md: { span: 16 },
    lg: { span: 12 },
  };
  return (
    <Row type="flex" justify="center" align="middle" style={{ margin: '10%' }}>
      <Col {...grid}>
        <Card title="Sign In">
          <Form onSubmit={handleSubmit}>
            <FormItem>
              {getFieldDecorator('email', {
                rules: [{ required: true, message: 'Please input your Email!' }],
              })(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />)}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your password!' }],
              })(<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />)}
            </FormItem>
            <FormItem
              validateStatus={validation.status}
              help={validation.help}
            >
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Sign In</Button>
              No account?<a href="/signup" style={{ marginLeft: '5px' }}>Sign up now!</a>
            </FormItem>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};
LoginForm.propTypes = {
  form: PropTypes.any.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

const WrappedLoginForm = Form.create()(LoginForm);
export default withRouter(WrappedLoginForm);
