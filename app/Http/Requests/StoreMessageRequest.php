<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreMessageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'receiver_id' => ['required', 'exists:users,id'],
            'body' => [
                'required',
                'string',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if (mb_strlen($value) > 1000) {
                        $fail('Сообщение не должно быть длиннее 1000 символов.');
                    }
                },
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'body.required' => 'Введите текст сообщения.',
            'receiver_id.required' => 'Выберите получателя.',
            'receiver_id.exists' => 'Выбранный пользователь не найден.',
        ];
    }
}
