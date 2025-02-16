import { useState } from "react";

interface UserProps {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
};

export default function AuthorSelect() {
    const [userData, setUserData] = useState<UserProps[]>([]);
    const [displayedAuthor, setDisplayedAuthor] = useState<boolean>(false);

    /*
    Fetch user data use with Author Selection
    : Author Selection is a part of Blog Feature
    */
    const displayAuthor = async () => {
        const url = 'http://localhost:3000/users/list'
        
        try {
            const response = await fetch(url, {
                method: 'GET',
            });
            if(!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const userData: UserProps[] = await response.json();
            console.log('Fetech user data', userData);
            setUserData(userData);
        } catch (error) {
            console.log('Fetch User list Error!', error)
        }
    }

    /*
    Button Toggle for Display user data
    : use displayAuthor()
    */
    const handleClick = async () => {
        // 
        if(displayedAuthor === false) {
            await displayAuthor();
        }

        setDisplayedAuthor(!displayedAuthor);
    };

    return (
        <div>
            <button type='button' onClick={handleClick}>
                {displayedAuthor ? 'Hide Author' : 'Display Author'}
            </button>
            {displayedAuthor && (
                <ul>
                {/* data = state value */}
                {userData.map(user => (
                    <li key={user._id}>
                        ({user.firstName}) ({user.lastName}) ({user.email})
                    </li>
                ))}
                </ul>
            )}
        </div>
    );
};