import dictionary from '@/services/dictionary';
import React, { memo } from 'react';

// Функция для доступа к вложенным свойствам
const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const Input = (props) => {
    const { type, className, name } = props;

    // Получаем текст для label из dictionary или используем name, если текст не найден
    const labelText = getNestedValue(dictionary, name) || name;
    console.log('render input ' + name);

    return (
        <label className="block">
            {type === 'checkbox' ? null : <span className="text-gray-700">{labelText}</span>}
            <input
                {...props}
                type={type || 'number'}
                className={className || 'w-full p-2 border rounded'}
            />
        </label>
    );
};

// Обернём компонент в memo для оптимизации
export default memo(Input);