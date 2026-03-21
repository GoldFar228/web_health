// src/components/home/LandingPage.tsx
import { useNavigate } from 'react-router-dom';
import './DietPage.css';

const DietPage = () => {
  const navigate = useNavigate();

  return (
    <div className="">
      <h1>Diet Page</h1>
      <div>some content</div>
      
    </div>
  );
};

export default DietPage;