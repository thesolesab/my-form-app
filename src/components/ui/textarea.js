import React from 'react'

const Textarea = (props) => {
    return (
        <textarea {...props} className='w-full p-2 border rounded resize-none' />
    )
}

export default Textarea