import Image from "next/image"

export const Test = () => {
    return (
        <div>
            <Image
                src="/one-punchman.jpg" // Replace with the correct path to your image
                alt="Test Image"
                width={300} // Set the width of the image
                height={200} // Set the height of the image
            />
        </div>
    );
};