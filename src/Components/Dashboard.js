import React, { useState } from 'react'

function Dashboard() {

    const [selectedFile, setSelectedFile] = useState(null);
    const [maizeAmount, setMaizeAmount] = useState(0);
    const [date, setDate] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        // Check if the file is an Excel file (xlsx or xls)
        if (file && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel')) {
        setSelectedFile(file);
        } else {
        setSelectedFile(null);
        alert('Please upload a valid Excel file (XLSX or XLS)');
        }
    };

    const handleFileDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel')) {
        setSelectedFile(file);
        } else {
        setSelectedFile(null);
        alert('Please upload a valid Excel file (XLSX or XLS)');
        }
    };

    const handleFormSubmit = async () => {
        setLoading(true);
        if(maizeAmount < 1){
            alert("Set Price of Maize");
            setLoading(false);
            return;
        }

      if(date == null){
        alert("Set The Date");
        setLoading(false);
        return;
      }

      const formattedDate = new Date(date).toLocaleDateString('en-GB');

        if (selectedFile) {
            const formData = new FormData();
            formData.append('maize_amount', maizeAmount);
            formData.append('date', formattedDate);
            formData.append('file', selectedFile);

            try {
              const response = await fetch(`${process.env.REACT_APP_API_URL}/upload`, {
                method: 'POST',
                body: formData
                })

                if (!response.ok) {
                  const errorData = await response.json();
                  alert(errorData.error);
                  setLoading(false)
                  return;
                }

                const successData = await response.json();
                alert(successData.message);
                setSelectedFile(null);
                setMaizeAmount(0);
                setDate(null);
                setLoading(false);

            } catch (error) {
                alert('Error:', error);
                setLoading(false);
            }
            
        } else {
            alert('Please upload a file');
            setLoading(false);
        }
    };

    const handleDeleteFile = () => {
        setSelectedFile(null);
    };

  return (
    <div className='bg-slate-900 text-white min-h-screen p-5 lg:p-10'>
        <div className='text-white text-center mt-10'>SEND BULK SMS</div>
        <form className='mx-2 lg:mx-32 border border-gray-500 p-5 lg:p-10 mt-10 rounded-lg'>
            <label className='text-center text-sm'>Upload Excel Sheet Containing Contacts</label>
            <div className="flex items-center justify-center w-full mt-2" onDrop={handleFileDrop} onDragOver={(e) => e.preventDefault()}>
          {selectedFile ? (
            <div className="flex gap-4 lg:gap-10 mt-5">
                <div className=''>
                    <img src={require('../images/excel.png')} alt="Excel Logo" className="w-32 h-32 mr-2" />
                    <div className="text-sm mr-2 text-center mt-5">{selectedFile.name}</div>
                </div>
              
              <button type="button" onClick={handleDeleteFile}  className="w-8 h-8 fill-current bg-red-500 text-white cursor-pointer rounded-full">
                X
              </button>
            </div>
          ) : (
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">XLS, XSLS</p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
            </label>
          )}
        </div>

            <div className='mt-4'>
                <label className='text-center text-sm'>Price of Maize:</label>
                <br />
                <input type='number' onChange={e => setMaizeAmount(e.target.value)} value={maizeAmount} className='p-3 rounded-lg bg-gray-700 w-full mt-1 text-white' />
            </div>

            <div className='mt-4'>
                <label className='text-center text-sm'>Date:</label>
                <br />
                <input type='date' onChange={e => setDate(e.target.value)} className='p-3 rounded-lg bg-gray-700 w-full mt-1 text-white' />
            </div>

            {
              loading && <div className='text-white mt-4'>Loading .....</div>
            }
            { !loading && <button 
            className='bg-blue-500 hover:bg-blue-900 p-2 rounded-lg mt-4' 
            onClick={(e)=>{
                e.preventDefault();
                handleFormSubmit();
            }}
            >Send SMS</button> }
            
        </form>
    </div>
  )
}

export default Dashboard