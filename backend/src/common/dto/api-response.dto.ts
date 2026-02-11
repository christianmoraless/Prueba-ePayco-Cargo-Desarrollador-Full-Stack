// ── Estructura uniforme de respuesta API ──
export class ApiResponseDto<T = any> {
    success: boolean;
    cod: number;
    message: string;
    data: T | null;

    constructor(partial: Partial<ApiResponseDto<T>>) {
        Object.assign(this, partial);
    }

    static ok<T>(data: T, message = 'Operación exitosa'): ApiResponseDto<T> {
        return new ApiResponseDto<T>({
            success: true,
            cod: 200,
            message,
            data,
        });
    }

    static created<T>(
        data: T,
        message = 'Recurso creado exitosamente',
    ): ApiResponseDto<T> {
        return new ApiResponseDto<T>({
            success: true,
            cod: 201,
            message,
            data,
        });
    }

    static error(
        message: string,
        cod = 400,
    ): ApiResponseDto<null> {
        return new ApiResponseDto<null>({
            success: false,
            cod,
            message,
            data: null,
        });
    }
}
