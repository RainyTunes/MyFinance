#!/usr/bin/env python3
import pandas as pd
import json

def read_excel_data():
    try:
        # 尝试读取所有sheet
        sheets = pd.read_excel('Dashboard.xlsx', sheet_name=None, engine='openpyxl')
        
        print("找到的sheet:")
        for name in sheets.keys():
            print(f"  - {name}")
        
        # 尝试读取信用卡相关的sheet
        for sheet_name, df in sheets.items():
            if '信用卡' in sheet_name or 'credit' in sheet_name.lower():
                print(f"\n=== {sheet_name} ===")
                print(f"形状: {df.shape}")
                print("列名:")
                for i, col in enumerate(df.columns):
                    print(f"  {i+1}. '{col}'")
                
                print("\n数据预览:")
                print(df.head(10))
                
                # 尝试导出清理后的数据
                df_clean = df.dropna(how='all').fillna('')
                data = df_clean.to_dict('records')[:10]  # 只取前10条
                print("\nJSON格式:")
                print(json.dumps(data, ensure_ascii=False, indent=2))
                break
                
    except Exception as e:
        print(f"错误: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    read_excel_data()