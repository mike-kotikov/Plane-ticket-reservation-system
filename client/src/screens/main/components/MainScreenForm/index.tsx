import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import * as Yup from 'yup';
import { withFormik, FormikProps, Form } from 'formik';
import { Moment } from 'moment';

import { mainScreenFormData } from '../../../../constants/formData';
import Input from '../../../../components/Input';

import { DatePicker } from '@material-ui/pickers';
import moment = require('moment');

import './style.scss';

interface IFormValues {
  from: string;
  to: string;
  flyOut: Moment;
  flyBack: Moment;
  ammountOfPassengers: number;
}

const InnerForm = (props: FormikProps<IFormValues>) => {
  const { values, setValues, touched, errors, handleChange, handleBlur, isSubmitting, isValid } = props;

  const fields: string[] = Object.keys(values);

  return (
    <Form >
      <Grid container spacing={8} className="main-form">
        {fields.map((field: string) => {
          let component: JSX.Element = null;

          if ((field === 'flyOut') || (field === 'flyBack')) {
            const handleDateChange = (date: Moment) => setValues({ ...values, [field]: date });

            component =
              <DatePicker
                name={field}
                className="main-form-date-picker"
                label={mainScreenFormData[field].label}
                variant="inline"
                value={values[field]}
                onChange={handleDateChange}
                format="DD-MM-YYYY"
                autoOk={true}
                minDate={field === 'flyOut' ? moment() : values.flyOut}
                disablePast
                disabled={field === 'flyBack' && !values.flyOut}
              />;
          } else {
            component =
              <Input
                name={field}
                className="main-form-input"
                label={mainScreenFormData[field].label}
                value={values[field]}
                placeholder={mainScreenFormData[field].placeholder}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched[field] && !!errors[field]}
                helperText={touched[field] ? errors[field] : ''}
              />;
          }

          return (
            <Grid key={field} item className="main-form-item">
              {component}
            </Grid>
          );
        })}

        <Button
          type="submit"
          className="main-form-btn"
          disabled={isSubmitting || !isValid}
        >
          Find flights
        </Button>
      </Grid>
    </Form>
  );
}

interface IFormProps {
  from?: string;
  to?: string;
  flyOut?: Moment;
  flyBack?: Moment;
  ammountOfPassengers?: number;
}

const MainScreenFormComponent = withFormik<IFormProps, IFormValues>({
  mapPropsToValues: () => ({
    from: mainScreenFormData.from.initValue,
    to: mainScreenFormData.to.initValue,
    flyOut: mainScreenFormData.flyOut.initValue,
    flyBack: mainScreenFormData.flyBack.initValue,
    ammountOfPassengers: mainScreenFormData.ammountOfPassengers.initValue,
  }),

  validationSchema: Yup.object().shape({
    from: Yup.string()
      .required('Departure airport is required'),
    to: Yup.string()
      .required('Destination airport is required'),
    ammountOfPassengers: Yup.number()
      .typeError('Only positive numbers are possible')
      .min(1, 'Must be a positive number')
      .required('Ammount of Passengers is required')
  }),

  handleSubmit: (values: IFormValues) => {
    console.log('form values: ', values);
  }
})(InnerForm);

export default MainScreenFormComponent;