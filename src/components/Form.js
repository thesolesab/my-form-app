"use client"

import { useCallback, useEffect, useState } from 'react';
import Input from './ui/input';
import Textarea from './ui/textarea';

export default function Form() {
    const [formState, setFormState] = useState({
        token: '',
        title: '',
        description: '',
        tags: [],
        budgetFrom: '',
        budgetTo: '',
        deadline: '',
        reminds: '',
        allAutoResponses: false,
        rules: {
            budget_from: '',
            budget_to: '',
            deadline_days: '',
            qty_freelancers: '',
            task_id: ''
        },
    });

    useEffect(() => {
        const savedToken = localStorage.getItem('task_token');
        if (savedToken) {
            setToken(savedToken);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(
            `https://deadlinetaskbot.productlove.ru/api/v1/tasks/client/newhardtask?token=${token}&title=${title}&description=${description}&tags=${tags}&budget_from=${budgetFrom}&budget_to=${budgetTo}&deadline=${deadline}&reminds=${reminds}&all_auto_responses=${allAutoResponses}&rules=${rules}`,
            {
                method: 'GET',
            }
        );

        if (response.status === 200) {
            alert('Задача опубликована');
        } else {
            alert('Ошибка при публикации задачи');
        }
    };

    const handleChange = useCallback((e) => {
        const { name, value, type } = e.target;
        if (name === 'token') {
            localStorage.setItem('task_token', e.target.value)
        }
        setFormState((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? e.target.checked : value,
        }));
    }, []);

    const renderForm = (object) => {
        const elements = []

        for (const el in object) {
            console.log(typeof object[el]);
            switch (typeof object[el]) {
                case 'string':
                    elements.push(
                        <Input
                            type="text"
                            placeholder={el}
                            name={el}
                            value={object[el]}
                            onChange={handleChange}
                        />
                    )
                    break
                case 'boolean':
                    elements.push(
                        <label className="flex items-center space-x-2">
                            <Input
                                type="checkbox"
                                checked={allAutoResponses}
                                onChange={handleChange}
                                className="p-2 border rounded"
                            />
                            <span>Все автоматические ответы</span>
                        </label>
                    )
                    break

                case 'object':
                    if (Array.isArray(object[el])) {
                        elements.push(
                            <Input
                                type="text"
                                placeholder="Теги (через запятую)"
                                value={object[el]}
                                onChange={handleChange}
                            />
                        )
                    } else {
                        const a = renderForm(object[el])
                        elements.push(a)
                    }
                default:
                    break;
            }

        }

        return elements
    }

    const form = renderForm(formState)

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {form}
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
                Опубликовать задачу
            </button>
        </form>
    );
}