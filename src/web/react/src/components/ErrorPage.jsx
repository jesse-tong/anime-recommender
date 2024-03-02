import { useRouteError } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ErrorPage() {
  const error = useRouteError();
  const {t} = useTranslation();
  console.error(error);

  return (
    <div className='container-fluid d-flex flex-column align-items-center text-center justify-content-center m-auto' id="error-page">
      <h1>Oops!</h1>
      <p>{t('error_text')}</p>
      
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}