import React from 'react';
import PropTypes from 'prop-types';

const Form = ({
  onSubmit,
  className = '',
  children,
  error,
  success,
  loading = false,
  submitLabel = 'Submit',
  submitDisabled = false,
  showSubmitButton = true,
  submitButtonProps = {},
  ...props
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loading && onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`space-y-6 ${className}`}
      {...props}
    >
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">{success}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {children}
      </div>

      {showSubmitButton && (
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || submitDisabled}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#16638A] hover:bg-[#0f4c6a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#16638A] ${loading || submitDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            {...submitButtonProps}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              submitLabel
            )}
          </button>
        </div>
      )}
    </form>
  );
};

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
  error: PropTypes.string,
  success: PropTypes.string,
  loading: PropTypes.bool,
  submitLabel: PropTypes.string,
  submitDisabled: PropTypes.bool,
  showSubmitButton: PropTypes.bool,
  submitButtonProps: PropTypes.object
};

export default Form;
