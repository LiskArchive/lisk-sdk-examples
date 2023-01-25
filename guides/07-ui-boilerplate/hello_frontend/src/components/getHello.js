import FixedMenuLayout from '../layout/header';

function GetHello() {
    return (
        <div className="App">
            <FixedMenuLayout />
            <div>
                <h1>Get all the Hello Messages</h1>
                <p>On this page, you can retrieve all the Hello messages sent to the network.</p>
            </div>
        </div>


    );
}

export default GetHello;