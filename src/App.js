import './App.css';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import ProfileList from './components/profileList/ProfileList';

initializeIcons();

const App = () => {
    return (
        <ProfileList/>
    );
}

export default App;
