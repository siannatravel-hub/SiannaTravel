import { useState } from 'react';

/**
 * Form handling hook with validation and submission state.
 */
export function useForm(initialValues, submitFn) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function validate() {
    const newErrors = {};
    Object.entries(values).forEach(([key, val]) => {
      if (typeof val === 'string' && !val.trim()) {
        newErrors[key] = 'Este campo es requerido';
      }
    });
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      newErrors.email = 'Email inválido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      await submitFn(values);
      setSubmitted(true);
      setValues(initialValues);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setValues(initialValues);
    setErrors({});
    setSubmitted(false);
    setSubmitError(null);
  }

  return {
    values,
    errors,
    submitting,
    submitted,
    submitError,
    handleChange,
    handleSubmit,
    reset,
  };
}
